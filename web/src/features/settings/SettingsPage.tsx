import React, { useRef } from 'react'
import { Download, Upload, Trash2, Database } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { dataExportService } from '@/utils/dataExport'
import styles from './SettingsPage.module.scss'

export const SettingsPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const storageInfo = dataExportService.getStorageInfo()

  const handleExport = () => {
    dataExportService.exportAllData()
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const success = await dataExportService.importData(file)
    if (!success) {
      alert('Failed to import data. Please check the file format.')
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
      <h1>Settings</h1>
      <p className={styles.subtitle}>Manage your local data and application preferences</p>

      {/* Data Management */}
      <Card className={styles.section}>
        <h2>Data Management</h2>
        <p>
          Your data is stored locally in your browser. Use these tools to backup and restore your
          information.
        </p>

        <div className={styles.actions}>
          <Button variant="primary" icon={<Download size={16} />} onClick={handleExport}>
            Export Data
          </Button>

          <Button variant="secondary" icon={<Upload size={16} />} onClick={handleImportClick}>
            Import Data
          </Button>

          <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleClearData}>
            Clear All Data
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Card>

      {/* Storage Information */}
      <Card className={styles.section}>
        <h2>Storage Information</h2>
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
      </Card>

      {/* Local-First Info */}
      <Card className={styles.section}>
        <h2>About Local-First</h2>
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
      </Card>
    </div>
  )
}
