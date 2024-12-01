export default interface IUser {
  id: number;
  uuid: string;
  name: string;
  password: string;
  email: string;
  reputation: number;
  image: string;
  token: string;
  salt: string;
}