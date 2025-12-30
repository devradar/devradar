import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';
import { useSkillsStore } from '@/stores/useSkillsStore';
import styles from './SkillDialog.module.scss';

export const SkillDialog: React.FC = () => {
    const { isAddDialogOpen, editingSkillId, closeAddDialog } = useSkillsStore();
    const { skills, addSkill, updateSkill, categories } = useSkills();

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category_id: '',
        category_name: '',
        description: '',
        reference_url: '',
    });

    const editingSkill = editingSkillId ? skills.find((s) => s.id === editingSkillId) : null;

    useEffect(() => {
        if (!isAddDialogOpen) return;

        if (editingSkill) {
            setFormData({
                name: editingSkill.name,
                slug: editingSkill.slug,
                category_id: editingSkill.category_id,
                category_name: editingSkill.category_name,
                description: editingSkill.description || '',
                reference_url: editingSkill.reference_url || '',
            });
        } else {
            setFormData({
                name: '',
                slug: '',
                category_id: '',
                category_name: '',
                description: '',
                reference_url: '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAddDialogOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');

        if (editingSkill) {
            updateSkill(editingSkill.id, {
                ...formData,
                slug,
            });
        } else {
            addSkill({
                ...formData,
                slug,
                category_id: formData.category_id || `custom-${Date.now()}`,
            });
        }

        closeAddDialog();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, category_name: value, category_id: value.toLowerCase().replace(/\s+/g, '-') }));
    };

    if (!isAddDialogOpen) return null;

    const existingCategories = categories.filter((c) => c !== 'all');

    return (
        <div className={styles.overlay} onClick={closeAddDialog}>
            <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <span>{'>'}</span> {editingSkill ? 'Edit Skill' : 'Add Skill'}
                    </h2>
                    <button className={styles.closeButton} onClick={closeAddDialog}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>Skill Name *</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className={styles.input}
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Kubernetes"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="category" className={styles.label}>Category *</label>
                            <select
                                id="category"
                                className={styles.select}
                                value={formData.category_name}
                                onChange={handleCategoryChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {existingCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="description" className={styles.label}>Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className={styles.textarea}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Brief description of the skill"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="reference_url" className={styles.label}>Reference URL</label>
                            <input
                                id="reference_url"
                                name="reference_url"
                                type="url"
                                className={styles.input}
                                value={formData.reference_url}
                                onChange={handleChange}
                                placeholder="https://example.com/docs"
                            />
                            <span className={styles.hint}>Link to documentation or learning resource</span>
                        </div>

                        <div className={styles.actions}>
                            <button type="button" className={styles.cancelButton} onClick={closeAddDialog}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={!formData.name || !formData.category_name}
                            >
                                {editingSkill ? 'Update' : 'Add Skill'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
