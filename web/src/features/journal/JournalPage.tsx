import { useJournal } from '@/hooks/useJournal';
import { JournalList } from './JournalList';
import { JournalDialog } from './JournalDialog';

export function JournalPage() {
    const journalHook = useJournal();

    return (
        <>
            <JournalList {...journalHook} />
            <JournalDialog addEntry={journalHook.addEntry} updateEntry={journalHook.updateEntry} />
        </>
    );
}
