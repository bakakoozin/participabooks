import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toggleMenu } from "../features/menuSlice";

// exemple d'un custom hook
// c'est une fonction qui permets d'utiliser des fonctionnalités tel que les hooks
// il doit absolument être préfixer par "use"
// il pourra être simplement utiliser dans n'importe quel autre composant (ici voir Home.jsx)
function useCloseMenu() {
	const dispatch = useDispatch();
	const { isMenuOpen } = useSelector((state) => state.menu);

	useEffect(() => {
		if (isMenuOpen) dispatch(toggleMenu());
	}, []);
}

export default useCloseMenu;
