import Link from '@docusaurus/Link';
import styles from './styles.module.css'

export function CardGrid({children}) {
    return <div className={styles.grid}>{children}</div>;
}

export function Card({icon, title, to, children}) {
    return (
        <Link className={styles.card} to={to}>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.title}>{title}</span>
            <span className={styles.body}>{children}</span>
        </Link>
    );
}