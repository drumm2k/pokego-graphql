export default function passwordTest(password) {
  // Test for min length
  if (password.length < 8) {
    throw Error('Password lenght should be 8+ symbols');
  }

  // Test for one lowercase letter, one uppercase letter, one number or symbol
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])/.test(password)) {
    throw Error(
      'Password must include: one lowercase letter, one uppercase letter, one number or symbol'
    );
  }
}
