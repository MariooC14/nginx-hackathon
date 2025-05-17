import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";


export default function AnomalyDetailsDialog({ anomaly }: { anomaly: NetworkLog }) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anomaly Details</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="w-96">
          {/* Show AI Analysis */}
          {/* Show the related logs */}
        </div>
      </DialogContent>
    </Dialog>
  )
};