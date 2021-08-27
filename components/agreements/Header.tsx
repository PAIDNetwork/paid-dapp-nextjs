import ProfileModel from "@/models/profileModel";
import { useSelector } from "react-redux";
import styles from "./Header.module.scss";

export function Header() {
  const profile: ProfileModel = useSelector(
    (state: any) => state.profileReducer.profile
  );

  let name = "";
  if (profile?.profileName) {
    name = profile.profileName + "!";
  }

  return (
    <header className={styles.header}>
      <div className={styles.subtitle}>Welcome,</div>
      <div className={styles.title}>{name}</div>
    </header>
  );
}
