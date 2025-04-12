import { useNavigate } from "react-router-dom";

import styles from "../../assets/style/scss/Button.module.scss";

const ButtonReturn = () => {
  const Navigate = useNavigate();

  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.returnBtn}`}
      onClick={() => Navigate(-1)}
    >
      Retour
    </button>
  );
};

export { ButtonReturn };
