import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function Figure({src, alt, caption, width}) {
    return (
        <figure className={styles.figure} style={{maxWidth:width}} >
            <img src={useBaseUrl(src)} alt={alt} className={styles.image} />
            <figcaption className={styles.caption}>{caption}</figcaption>
        </figure>
    )
}