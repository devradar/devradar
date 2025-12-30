import React from 'react';
import { SkillsList } from './SkillsList';
import { SkillDialog } from './SkillDialog';
import { JournalDialog } from '@/features/journal/JournalDialog';
import { useJournal } from '@/hooks/useJournal';

export const SkillsPage: React.FC = () => {
    const journalHook = useJournal();

    return (
        <>
            <SkillsList />
            <SkillDialog />
            <JournalDialog addEntry={journalHook.addEntry} updateEntry={journalHook.updateEntry} />
        </>
    );
};
