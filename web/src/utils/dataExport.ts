/**
 * Data export/import utilities for local-first architecture.
 * Provides backup and restore functionality for all app data.
 */

import type { Skill, UserActivity } from "@/types"

export const dataExportService = {
    /**
     * Clear all application data from localStorage.
     * Removes skills, journal, and theme data, then reloads the page.
     */
    clearAllData(): void {
        const keys = ['devradar_skills', 'devradar_journal', 'devradar_theme']
        keys.forEach((key) => localStorage.removeItem(key))
        window.location.reload()
    },

    /**
     * Get data storage information for all stored data.
     * Calculates the size of skills, journal, and theme data.
     * 
     * @returns Object containing existence flags and sizes for each data type
     */
    getStorageInfo() {
        const skills = localStorage.getItem('devradar_skills')
        const journal = localStorage.getItem('devradar_journal')
        const theme = localStorage.getItem('devradar_theme')

        const calculateSize = (data: string | null) => {
            return data ? new Blob([data]).size : 0
        }

        return {
            skills: {
                exists: !!skills,
                size: calculateSize(skills)
            },
            journal: {
                exists: !!journal,
                size: calculateSize(journal)
            },
            theme: {
                exists: !!theme,
                size: calculateSize(theme)
            },
            totalSize: calculateSize(skills) + calculateSize(journal) + calculateSize(theme)
        }
    },

    /**
     * Export journal entries to a CSV file.
     * Creates a CSV with columns: skill_name, skill_category, activity_name, level, description, date.
     * One entry per row, properly escaped for CSV format.
     */
    exportJournalsAsCSV(): void {
        const journalData = localStorage.getItem('devradar_journal')
        if (!journalData) {
            console.warn('No journal data to export')
            return
        }

        try {
            const journalStorage = JSON.parse(journalData)
            const journals = journalStorage.entries || []

            if (journals.length === 0) {
                console.warn('No journal entries to export')
                return
            }

            // Escape CSV value for safe export
            const escapeCsv = (value: string | number | null | undefined): string => {
                if (value === null || value === undefined) return ''
                const str = String(value)
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`
                }
                return str
            }

            // Build CSV content with headers and data rows
            const headers = [
                'skill_name',
                'skill_category',
                'activity_name',
                'level',
                'description',
                'date'
            ]

            const rows = journals.map((entry: UserActivity) => [
                escapeCsv(entry.skill_name),
                escapeCsv(entry.skill_category),
                escapeCsv(entry.activity_name),
                escapeCsv(entry.level),
                escapeCsv(entry.description),
                escapeCsv(entry.date)
            ].join(','))

            const csvContent = [headers.join(','), ...rows].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `journals-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Journal export failed:', error)
        }
    },

    /**
     * Exports only user-created skills (filters out predefined skills).
     * Creates a CSV with columns: name, slug, description, reference_url, category_name.
     * Downloads the file automatically to the user's downloads folder.
     */
    exportCustomSkillsAsCSV(): void {
        const skillsData = localStorage.getItem('devradar_skills')
        if (!skillsData) {
            console.warn('No skills data to export')
            return
        }

        try {
            const allSkills = JSON.parse(skillsData)
            // Filter only custom skills
            const customSkills = allSkills.filter((skill: Skill & { is_custom: boolean }) => skill.is_custom === true)

            if (customSkills.length === 0) {
                console.warn('No custom skills to export')
                return
            }

            // Escape CSV value for safe export
            const escapeCsv = (value: string | number | null | undefined): string => {
                if (value === null || value === undefined) return ''
                const str = String(value)
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`
                }
                return str
            }

            // Build CSV content with headers and data rows
            const headers = [
                'name',
                'slug',
                'description',
                'reference_url',
                'category_name'
            ]

            const rows = customSkills.map((skill: Skill) => [
                escapeCsv(skill.name),
                escapeCsv(skill.slug),
                escapeCsv(skill.description),
                escapeCsv(skill.reference_url),
                escapeCsv(skill.category_name)
            ].join(','))

            const csvContent = [headers.join(','), ...rows].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `custom_skills-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Custom skills export failed:', error)
        }
    },

    /**
     * Import journal entries from a CSV file.
     * Replaces all existing journal data with entries from the CSV file.
     * Expected CSV columns: skill_name, skill_category, activity_name, level, description, date.
     * IDs and timestamps are automatically generated during import.
     * 
     * @param file - The CSV file containing journal entries
     * @returns Promise that resolves to true if import succeeds, false otherwise
     */
    importJournalsFromCSV(file: File): Promise<boolean> {
        return new Promise((resolve) => {
            const reader = new FileReader()

            reader.onload = (e) => {
                try {
                    const csvContent = e.target?.result as string
                    const lines = csvContent.split('\n').filter(line => line.trim())

                    if (lines.length < 2) {
                        throw new Error('CSV file is empty or has no data rows')
                    }

                    // Parse CSV line with proper quote handling
                    const parseCsvLine = (line: string): string[] => {
                        const result: string[] = []
                        let current = ''
                        let inQuotes = false

                        for (let i = 0; i < line.length; i++) {
                            const char = line[i]

                            if (char === '"') {
                                if (inQuotes && line[i + 1] === '"') {
                                    // Escaped quote
                                    current += '"'
                                    i++
                                } else {
                                    // Toggle quote state
                                    inQuotes = !inQuotes
                                }
                            } else if (char === ',' && !inQuotes) {
                                result.push(current)
                                current = ''
                            } else {
                                current += char
                            }
                        }
                        result.push(current)
                        return result
                    }

                    // Skip header row
                    const dataLines = lines.slice(1)

                    // Parse entries from CSV lines
                    const entries = dataLines.map((line, index) => {
                        const values = parseCsvLine(line)

                        // Create entry object with generated id
                        return {
                            id: `local-${Date.now()}-${index}`,
                            skill_name: values[0] || '',
                            skill_category: values[1] || '',
                            activity_name: values[2] || '',
                            level: parseInt(values[3]) || 1,
                            description: values[4] || '',
                            date: values[5] || new Date().toISOString().split('T')[0]
                        }
                    })

                    // Validate entries have required fields
                    const validEntries = entries.filter(entry =>
                        entry.skill_name &&
                        entry.skill_category &&
                        entry.activity_name &&
                        entry.description
                    )

                    if (validEntries.length === 0) {
                        throw new Error('No valid entries found in CSV')
                    }

                    // Create new journal storage with imported entries
                    const newStorage = {
                        entries: validEntries,
                        lastId: validEntries.length
                    }

                    // Replace journal data in localStorage
                    localStorage.setItem('devradar_journal', JSON.stringify(newStorage))

                    // Reload the page to reflect changes
                    window.location.reload()
                    resolve(true)
                } catch (error) {
                    console.error('CSV import failed:', error)
                    alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
                    resolve(false)
                }
            }

            reader.onerror = () => {
                alert('Failed to read file')
                resolve(false)
            }
            reader.readAsText(file)
        })
    }
}
