import { User } from '../../models';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name, phoneNumber } = req.body;

    try {
      const [updatedRowsCount, updatedUsers] = await User.update(
        { name, phoneNumber },
        { where: { email }, returning: true }
      );

      if (updatedRowsCount > 0) {
        res.status(200).json(updatedUsers[0]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating user profile' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}