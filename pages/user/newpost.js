
import StorageCommunicator from '../../components/communications/StorageCommunicator'
import Image from 'next/image'

const newpost = () => {
	return (
		// !! navigation ner required! Already included in imported StorageCommunicator-file!
		<div>
			<Image
			className="newpost-img"
			src="/assets/iceland-5104385_1920.jpg"
			alt="Beautiful nature"
			layout="fill"
			objectfit="fit"
			objectposition="center bottom"
			quality={75}
			/>
			<StorageCommunicator/>
		</div>
	)
}

export default newpost