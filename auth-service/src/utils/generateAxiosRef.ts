import { IRequest } from 'src/shared/interfaces/request.interface';

export const generateAxiosRef = (req: IRequest, baseUrl: string) => ({
  method: req.method,
  url: baseUrl + req.url,
  headers: req.headers as any,
  data: req.body,
  params: req.params,
  user: req.user,
});
