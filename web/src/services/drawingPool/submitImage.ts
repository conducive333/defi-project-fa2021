import { BASE_URL } from '../consts';

interface PostImage {
  drawingPoolId: string;
  address: string;
  name: string;
  description: string;
  file: File | null;
}

export const submitImage = async ({ drawingPoolId, address, name, description, file }: PostImage): Promise<boolean> => {
  if (file === null) {
    return false;
  }

  const url = `drawing-pool/${drawingPoolId}/submission/image`;
  const formData = new FormData();
  formData.append('address', address);
  formData.append('name', name);
  formData.append('description', description);
  formData.append('file', file);
  console.log('form data', formData);

  const options: RequestInit = {
    method: 'POST',
    // headers: {
    //   'Content-Type': `multipart/form-data`
    // },
    body: formData,
    credentials: 'include'
  }

  console.log('opts', options);
  return await postApi(url, options);
}

export async function postApi(partialUrl: string, options: RequestInit): Promise<boolean> {
  const url = `${BASE_URL}/${partialUrl}`;

  const response = await fetch(url, options);
  console.log('**res', await response.text());

  return response.ok
}