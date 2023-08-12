/* Check a password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter */

export function verifyPassword(password = ''){
	return password
	.match(
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
	)
}
