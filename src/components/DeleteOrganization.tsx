import React from "react";

type Props = {
  onClickHandler: (id: string) => void;
  itemRef: React.RefObject<HTMLElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

export default function DeleteOrganization({ itemRef, onClickHandler, open, setOpen }: Props) {
  return <div>DeleteOrganization</div>;
}
