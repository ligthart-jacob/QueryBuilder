export default interface IQuestion {
  id: number;
  uuid: string;
  users_id: number;
  title: string;
  description: string;
  status: boolean;
  views: number;
  slug: string;
  created: Date;
  updated: Date;
}