import { redirect } from '@sveltejs/kit';

export async function GET(req, res) {
  const FAQ =
    'https://www.notion.so/The-Faithful-FAQ-s-05fe7a8a5566447e82181a4068198ac4';

  throw redirect(302, FAQ);
}
