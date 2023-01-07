import axios from "axios";

const test = async (name, method, path, body) => {
  let res;

  console.log(`\n\n${name}:`)

  if (method === 'GET') {
    res = await axios.get(`http://localhost:3000/api${path}`)
  } else if (method === 'PORT') {
    res = await axios.post(`http://localhost:3000/api${path}`, body)
  }

  console.log('DATA: ', res.data)
  console.log('COOKIES: ', res.headers['set-cookie'])
}


const main = async () => {
  const user = { username: 'Homka122', password: 'pass1234' }
  await test('SIGNUP', 'POST', '/auth/signup', body);
  await test('LOGIN', 'POST', '/auth/login', body);
}

main()