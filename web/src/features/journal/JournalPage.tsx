import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useJournal } from '@/hooks/useJournal';
import { JournalList } from './JournalList';
import { JournalDialog } from './JournalDialog';

export function JournalPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const journalHook = useJournal();

    // Handle skill filter from URL query parameter
    useEffect(() => {
        const skillParam = searchParams.get('skill');
        if (skillParam && skillParam !== journalHook.skillNameFilter) {
            journalHook.setSkillName(skillParam);
        } else if (!skillParam && journalHook.skillNameFilter) {
            journalHook.setSkillName(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Override setSkillName to also update URL
    const handleSetSkillName = (skillName: string | null) => {
        journalHook.setSkillName(skillName);
        if (skillName) {
            setSearchParams({ skill: skillName });
        } else {
            navigate('/journal', { replace: true });
        }
    };

    return (
        <>
            <JournalList {...journalHook} setSkillName={handleSetSkillName} />
            <JournalDialog addEntry={journalHook.addEntry} updateEntry={journalHook.updateEntry} />
        </>
    );
}
