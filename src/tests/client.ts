import Axios from 'axios'

const baseURL = `0.0.0.0:8000`

export const client = Axios.create({ baseURL })