import ContentLoader from "react-content-loader"

const WeatherSkelleton = (props) => (
  <ContentLoader 
    speed={2}
    width={300}
    height={280}
    viewBox="0 0 300 280"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="24" y="17" rx="15" ry="15" width="120" height="241" /> 
    <rect x="166" y="137" rx="15" ry="15" width="110" height="121" /> 
    <rect x="164" y="13" rx="15" ry="15" width="110" height="109" /> 
    <path d="M 181.786 44.743 h 87.38 M 181.786 58.825 h 87.38 M 46.26 44.743 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" /> 
    <path d="M -43.69 0 h 87.38" />
  </ContentLoader>
)

export default WeatherSkelleton