import { useEffect } from "react";

// Pour mettre à jour la balise meta "description" de la page
export function useMetaDescription(description) {
  useEffect(() => {
    if (!description) return;

    const existingMetaTag = document.querySelector("meta[name='description']");
    const metaTag =
      existingMetaTag ??
      (() => {
        const meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
        return meta;
      })();

    metaTag.content = description;

    return () => {
      metaTag.content = "";
    };
  }, [description]);
}
