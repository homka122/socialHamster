import axios from "axios";

const test = async (name, body, path) => {
  console.log(`\n\n${name}:`)
  const res = await axios.post(`http://localhost:3000/api${path}`, body)
  console.log('DATA: ', res.data)
  console.log('COOKIES: ', res.headers['set-cookie'])
}


const main = async () => {
  const user = { username: 'Homka122', password: 'pass1234' }
  await test('SIGNUP', user, '/auth/signup');
  await test('LOGIN', user, '/auth/login');
}

main()