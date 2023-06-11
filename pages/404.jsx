import React from 'react'
import styles from 'styles/fourOhfour.module.css'
import { useRouter } from 'next/router'

const FourOhFour = () => {
	const router = useRouter();

  	return (
		<>
			<div className={`${styles.container} ${styles.containerStar}`}>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star1}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				<div className={styles.star2}></div>
				</div>
				<div className={`${styles.container} ${styles.containerBird}`}>
				<div className={`${styles.bird} ${styles.birdAnim}`}>
					<div className={`${styles.birdContainer}`}>
					<div className={`${styles.wing} ${styles.wingLeft}`}>
						<div className={styles.wingLeftTop}></div>
					</div>
					<div className={`${styles.wing} ${styles.wingRight}`}>
						<div className={styles.wingRightTop}></div>
					</div>
					</div>
				</div>
				<div className={`${styles.bird} ${styles.birdAnim}`}>
					<div className={`${styles.birdContainer}`}>
					<div className={`${styles.wing} ${styles.wingLeft}`}>
						<div className={styles.wingLeftTop}></div>
					</div>
					<div className={`${styles.wing} ${styles.wingRight}`}>
						<div className={styles.wingRightTop}></div>
					</div>
					</div>
				</div>
				<div className={`${styles.bird} ${styles.birdAnim}`}>
					<div className={`${styles.birdContainer}`}>
					<div className={`${styles.wing} ${styles.wingLeft}`}>
						<div className={styles.wingLeftTop}></div>
					</div>
					<div className={`${styles.wing} ${styles.wingRight}`}>
						<div className={styles.wingRightTop}></div>
					</div>
					</div>
				</div>
				<div className={`${styles.bird} ${styles.birdAnim}`}>
					<div className={`${styles.birdContainer}`}>
					<div className={`${styles.wing} ${styles.wingLeft}`}>
						<div className={styles.wingLeftTop}></div>
					</div>
					<div className={`${styles.wing} ${styles.wingRight}`}>
						<div className={styles.wingRightTop}></div>
					</div>
					</div>
				</div>
				<div className={`${styles.bird} ${styles.birdAnim}`}>
					<div className={`${styles.birdContainer}`}>
					<div className={`${styles.wing} ${styles.wingLeft}`}>
						<div className={styles.wingLeftTop}></div>
					</div>
					<div className={`${styles.wing} ${styles.wingRight}`}>
						<div className={styles.wingRightTop}></div>
					</div>
					</div>
				</div>
				<div className={`${styles.bird} ${styles.birdAnim}`}>
					<div className={`${styles.birdContainer}`}>
					<div className={`${styles.wing} ${styles.wingLeft}`}>
						<div className={styles.wingLeftTop}></div>
					</div>
					<div className={`${styles.wing} ${styles.wingRight}`}>
						<div className={styles.wingRightTop}></div>
					</div>
					</div>
				</div>
				<div className={styles.containerTitle}>
					<div className={styles.title}>
					<div className={styles.number}>4</div>
					<div className={styles.moon}>
						<div className={styles.face}>
						<div className={styles.mouth}></div>
						<div className={styles.eyes}>
							<div className={styles.eyeLeft}></div>
							<div className={styles.eyeRight}></div>
						</div>
						</div>
					</div>
					<div className={styles.number}>4</div>
					</div>
					<div className={styles.subtitle}>Oops. Looks like you took a wrong turn.</div>
					<button onClick={() => router.back()} className={styles.fourOhFourBtn}>Go back</button>
				</div>
			</div>
		</>
  )
}

export default FourOhFour