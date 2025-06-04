import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { createContext, useContext, useState, type ReactNode } from "react";

type DialogContext = {
  setAboutOpen: (open: boolean) => void,
}

const aboutContext = createContext<DialogContext>({} as DialogContext);

export default function AboutDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(localStorage.getItem('hideAbout') !== "true");
  console.log('About dialog open:', open);

  const setAboutOpen = (open: boolean) => {
    if (!open) {
      localStorage.setItem('hideAbout', 'true');
    } else {
      localStorage.removeItem('hideAbout');
    }
    setOpen(open);
  }

  const value = {
    setAboutOpen,
  }

  return (
    <aboutContext.Provider value={value}>
      <Dialog open={open} onOpenChange={(value) => setAboutOpen(value)} >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Info</DialogTitle>
          </DialogHeader>
          <ScrollArea>
            This project has been developed as part of a hackathon hosted by University College Cork and sponsored by NGINX.
            <hr className="my-2" />
            What you see here is the result of the collaborative efforts of the following individuals:
            <ul className="list-disc pl-5 mt-4">
              <li>Van-Mario Caval - <Link className="underline text-blue-500" to="https://github.com/MariooC14">MariooC14</Link></li>
              <li>David Wilson - <Link className="underline text-blue-500" to="https://github.com/Szazlo/">Szazlo</Link></li>
              <li>Celso Vinicius Franco Ferreira - <Link className="underline text-blue-500" to="https://github.com/0SL3C">0SL3C</Link></li>
            </ul>
            <hr className="my-2" />
            The data used in this project is from a local log file of 9999 requests to a web server, which was provided by the hackathon organizers. The app was not designed to be responsive, so it may look poor on smaller screens.
            <hr className="my-2" />
            <strong>Note:</strong> The geolocation and AI features are not functional as they require a valid API key, which is not provided in this project.
          </ScrollArea>
          <div className="flex justify-end">
            <Button onClick={() => setAboutOpen(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {children}
    </aboutContext.Provider>
  )
};

export const useAboutDialog = () => {
  const context = useContext(aboutContext);
  if (!context) {
    throw new Error("useAboutDialog must be used within an AboutDialogProvider");
  }
  return context;
}
