import React, { useRef } from 'react'
import { Upload, Trash2, Database, FileText, Award } from 'lucide-react'
import { dataExportService } from '@/utils/dataExport'
import styles from './SettingsPage.module.scss'

export const SettingsPage: React.FC = () => {
    const csvJournalInputRef = useRef<HTMLInputElement>(null)
    const storageInfo = dataExportService.getStorageInfo()

    const handleExportJournals = () => {
        dataExportService.exportJournalsAsCSV()
    }

    const handleExportCustomSkills = () => {
        dataExportService.exportCustomSkillsAsCSV()
    }

    const handleImportJournalsClick = () => {
        csvJournalInputRef.current?.click()
    }

    const handleCsvJournalFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const confirmed = window.confirm(
            'Warning: This will REPLACE all your existing journal entries with the data from this CSV file. This action cannot be undone. Continue?'
        )

        if (!confirmed) {
            event.target.value = ''
            return
        }

        const success = await dataExportService.importJournalsFromCSV(file)
        if (!success) {
            alert('Failed to import journals. Please check the CSV file format.')
        }
        // Reset the input
        event.target.value = ''
    }

    const handleClearData = () => {
        const confirmed = window.confirm(
            'Are you sure you want to clear all data? This action cannot be undone.'
        )
        if (confirmed) {
            dataExportService.clearAllData()
        }
    }

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        SYSTEM <span className={styles.titleAccent}>SETTINGS</span>
                    </h1>
                    <p className={styles.subtitle}>Manage your local data and application preferences</p>
                </div>
            </div>

            {/* Data Management */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>DATA MANAGEMENT</h2>
                </div>
                <div className={styles.cardContent}>
                    <p className={styles.cardDescription}>
                        Export your data as CSV files or clear all stored data from your browser.
                    </p>

                    <div className={styles.separator}>CSV Exports</div>

                    <div className={styles.actions}>
                        <button className={`${styles.actionButton} ${styles.info}`} onClick={handleExportJournals}>
                            <FileText size={16} />
                            Export Journals (CSV)
                        </button>

                        <button className={`${styles.actionButton} ${styles.info}`} onClick={handleExportCustomSkills}>
                            <Award size={16} />
                            Export Custom Skills (CSV)
                        </button>
                    </div>

                    <div className={styles.separator}>CSV Imports</div>

                    <div className={styles.actions}>
                        <button className={`${styles.actionButton} ${styles.warning}`} onClick={handleImportJournalsClick}>
                            <Upload size={16} />
                            Import Journals (CSV)
                        </button>
                    </div>

                    <div className={styles.separator}>Data Management</div>

                    <div className={styles.actions}>
                        <button className={`${styles.actionButton} ${styles.danger}`} onClick={handleClearData}>
                            <Trash2 size={16} />
                            Clear All Data
                        </button>
                    </div>
                </div>

                <input
                    ref={csvJournalInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvJournalFileChange}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Storage Information */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>STORAGE INFORMATION</h2>
                </div>
                <div className={styles.cardContent}>
                    <div className={styles.storageGrid}>
                        <div className={styles.storageItem}>
                            <Database size={16} />
                            <div>
                                <div className={styles.label}>Skills</div>
                                <div className={styles.value}>{formatBytes(storageInfo.skills.size)}</div>
                            </div>
                        </div>

                        <div className={styles.storageItem}>
                            <Database size={16} />
                            <div>
                                <div className={styles.label}>Journal</div>
                                <div className={styles.value}>{formatBytes(storageInfo.journal.size)}</div>
                            </div>
                        </div>

                        <div className={styles.storageItem}>
                            <Database size={16} />
                            <div>
                                <div className={styles.label}>Preferences</div>
                                <div className={styles.value}>{formatBytes(storageInfo.theme.size)}</div>
                            </div>
                        </div>

                        <div className={`${styles.storageItem} ${styles.total}`}>
                            <Database size={16} />
                            <div>
                                <div className={styles.label}>Total Storage</div>
                                <div className={styles.value}>{formatBytes(storageInfo.totalSize)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Local-First Info */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>ABOUT LOCAL-FIRST</h2>
                </div>
                <div className={styles.cardContent}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <h3>✅ Private</h3>
                            <p>Your data never leaves your device</p>
                        </div>
                        <div className={styles.infoItem}>
                            <h3>⚡ Fast</h3>
                            <p>Instant read/write operations</p>
                        </div>
                        <div className={styles.infoItem}>
                            <h3>🔒 Secure</h3>
                            <p>No cloud, no servers, no accounts</p>
                        </div>
                        <div className={styles.infoItem}>
                            <h3>📱 Portable</h3>
                            <p>Export and import your data anywhere</p>
                        </div>
                    </div>

                    <div className={styles.warning}>
                        <strong>Important:</strong> Your data is stored in this browser only. Clear your browser
                        data will delete all information. Use the export feature regularly to backup your data.
                    </div>
                </div>
            </div>
        </div>
    )
}
