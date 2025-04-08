export const FILE_TYPE_IMAGES = ['image/jpeg', 'image/gif', 'image/png', 'image/raw', 'image/heif', 'image/webp', 'image/heic'];
export const FILE_TYPE_VIDEOS_IMAGES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/mpeg', 'video/ogg', 'video/webm', 'video/quicktime', 'video/3gpp', 'video/3gpp2']
export const SLIDER_IMAGE_TYPES = ['jpeg', 'jpg', 'gif', 'png'];
export const SLIDER_VIDEO_TYPES = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv'];

export const PROFILE_IMG_MAX_SIZE = 2097152;
export const IMG_UNIT_MAX_SIZE = 10485760;
export const VID_UNIT_MAX_SIZE = 314572800;
export const TOTAL_MAX_SIZE = 314572800;

export const RANDOM_SENTENCES = [
  "Unlock the gateway to your uncharted adventures - Click here to craft your inaugural travel tale.",
  "Dive into the enigma of unexplored destinations - Click here to pen your maiden travel chronicle.",
  "Embark on a journey of secrets untold - Click here to embark on your inaugural travel odyssey.",
  "Venture into the unknown and create your debut travel saga - Click here to start writing your first travel epic."
];

export const ASIDE_MENU_TOP = [
  { name: 'Dashboard', icon: 'home', link: '/user/dashboard', class: null },
  { name: 'Log out', icon: 'power_settings_new', link: '#logout', class: null },
  { name: 'Account settings', icon: 'manage_accounts', link: '/user/settings', class: null }
];

export const ASIDE_MENU_BOTTOM = [
  { name: 'Close menu', icon: 'chevron_left', link: '#close', class: null },
  { name: 'Write new post', icon: 'edit', link: '#newpost', class: null },
  { name: 'View gallery', icon: 'grid_on', link: '/user/posts', class: null },
  { name: 'Receipts', icon: 'receipt_long', link: '/user/receipts/home', class: null },
  { name: 'Weather', icon: 'partly_cloudy_day', link: '/weather', class: null }
];

export const VERTICAL_MENU = [
  { name: 'Dashboard', icon: 'home', link: '/user/dashboard', class: 'verticalMenuItem' },
  { name: 'Account settings', icon: 'manage_accounts', link: '/user/settings', class: 'verticalMenuItem' },
  { name: 'View gallery', icon: 'grid_on', link: '/user/posts', class: 'verticalMenuItem' },
  { name: 'Receipts', icon: 'receipt_long', link: '/user/receipts/home', class: 'verticalMenuItem' },
  { name: 'Weather', icon: 'partly_cloudy_day', link: '/weather', class: 'verticalMenuItem' },
  { name: 'Log out', icon: 'power_settings_new', link: '#logout', class: 'verticalMenuItem' },
]

export const MOCK_COUNTRY_LIST = [
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Iceland',
  'United States',
  'Canada',
  'Mexico',
  'Brazil',
  'Argentina',
  'Chile',
]

export const FALLBACK_AVATAR_URL = 'https://api.dicebear.com/9.x/bottts-neutral/svg'
