import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteLocalStorage = () => {
    localStorage.clear();
    toast({
      title: "Local Storage Cleared",
      description: "All local storage data has been deleted.",
    });
    setConfirmOpen(false);
  };

  const getLocalStorageSize = () => {
    let total = 0;
    for (let x in localStorage) {
      if (!localStorage.hasOwnProperty(x)) {
        continue;
      }
      total += ((localStorage[x].length + x.length) * 2);
    }
    return (total / 1024).toFixed(2);
  };

  const getLocalStorageItems = () => {
    return Object.keys(localStorage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your application settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Local Storage</h3>
            <p>Size: {getLocalStorageSize()} KB</p>
            <p>Items: {getLocalStorageItems().join(', ')}</p>
            <Button onClick={() => setConfirmOpen(true)} variant="destructive">Delete All Local Storage</Button>
          </div>
        </div>
      </DialogContent>
      {confirmOpen && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>Are you sure you want to delete all local storage data? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setConfirmOpen(false)} variant="secondary">Cancel</Button>
              <Button onClick={handleDeleteLocalStorage} variant="destructive">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
