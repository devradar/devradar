/**
 * Data export/import utilities for local-first architecture
 * Provides backup and restore functionality for all app data
 */

interface ExportData {
    skills: string | null
    journal: string | null
    theme: string | null
    exportDate: string
    version: string
}

export const dataExportService = {
    /**
     * Export all application data to a JSON file
     */
    exportAllData(): void {
        const data: ExportData = {
            skills: localStorage.getItem('devradar_skills'),
            journal: localStorage.getItem('devradar_journal'),
            theme: localStorage.getItem('devradar_theme'),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `devradar-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    },

    /**
     * Import application data from a JSON file
     */
    importData(file: File): Promise<boolean> {
        return new Promise((resolve) => {
            const reader = new FileReader()

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string) as ExportData

                    // Validate the data structure
                    if (!data.exportDate || !data.version) {
                        throw new Error('Invalid backup file format')
                    }

                    // Import each data type if it exists
                    if (data.skills) {
                        localStorage.setItem('devradar_skills', data.skills)
                    }
                    if (data.journal) {
                        localStorage.setItem('devradar_journal', data.journal)
                    }
                    if (data.theme) {
                        localStorage.setItem('devradar_theme', data.theme)
                    }

                    // Reload the page to reflect changes
                    window.location.reload()
                    resolve(true)
                } catch (error) {
                    console.error('Import failed:', error)
                    resolve(false)
                }
            }

            reader.onerror = () => resolve(false)
            reader.readAsText(file)
        })
    },

    /**
     * Clear all application data
     */
    clearAllData(): void {
        const keys = ['devradar_skills', 'devradar_journal', 'devradar_theme']
        keys.forEach((key) => localStorage.removeItem(key))
        window.location.reload()
    },

    /**
     * Get data storage information
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
    }
}
