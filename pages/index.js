
import Image from 'next/image';
import styles from 'styles/startpage.module.css'
import Link from 'next/link';
import imageAsset from 'public/assets/overview_tokyo_orginal.webp'

const Home = () => {
  const headerText = 'Dark Marshmallow'
  const btnText = 'Get started'
  const smallHeader = 'Your travel companion app'

  return (
      <div className={styles.root}>
          <Image layout='fill' objectFit='cover' src={imageAsset} priority={true} alt='Overlook Tokyo'/>
          <div className={styles.container}>
              <h5 className={styles.miniHeader}>{smallHeader}</h5>
              <div>
                  <div className={styles.headerContainer}>
                      <h2 className={styles.header}>
                          <span className={styles.iconContainer}>         
                              {headerText}
                          </span>
                          <span className={`material-symbols-outlined ${styles.icon}`}>
                              travel
                          </span>
                      </h2>
                  </div>
              </div>
              <Link href={'/login'} legacyBehavior>{btnText}</Link>
          </div>
      </div>
  );
}

export default Home;
