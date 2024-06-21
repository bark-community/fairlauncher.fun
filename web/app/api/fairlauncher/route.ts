import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  
  // Connect to the database
  const { db } = await connectToDatabase();

  switch (method) {
    case 'POST':
      // Handle token launch initiation
      return handleTokenLaunch(req, res, db);
    case 'GET':
      // Handle fetching token details or status
      return handleGetTokenDetails(req, res, db);
    case 'PUT':
      // Handle updating token details
      return handleUpdateToken(req, res, db);
    case 'DELETE':
      // Handle deleting a token
      return handleDeleteToken(req, res, db);
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const handleTokenLaunch = async (req: NextApiRequest, res: NextApiResponse, db: any) => {
  try {
    const { tokenName, totalSupply, burnAmount, buyAmount, releaseCurve } = req.body;

    // Perform necessary validation and logic
    if (!tokenName || !totalSupply || !burnAmount || !buyAmount || !releaseCurve) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const result = await db.collection('tokens').insertOne({
      tokenName,
      totalSupply,
      burnAmount,
      buyAmount,
      releaseCurve,
      createdAt: new Date()
    });

    res.status(201).json({ success: true, data: result.ops[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const handleGetTokenDetails = async (req: NextApiRequest, res: NextApiResponse, db: any) => {
  try {
    const { tokenId } = req.query;

    if (!tokenId) {
      return res.status(400).json({ success: false, message: 'Missing token ID' });
    }

    const token = await db.collection('tokens').findOne({ _id: new ObjectId(tokenId as string) });

    if (!token) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }

    res.status(200).json({ success: true, data: token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const handleUpdateToken = async (req: NextApiRequest, res: NextApiResponse, db: any) => {
  try {
    const { tokenId } = req.query;
    const { tokenName, totalSupply, burnAmount, buyAmount, releaseCurve } = req.body;

    if (!tokenId) {
      return res.status(400).json({ success: false, message: 'Missing token ID' });
    }

    const updateData: any = {};
    if (tokenName) updateData.tokenName = tokenName;
    if (totalSupply) updateData.totalSupply = totalSupply;
    if (burnAmount) updateData.burnAmount = burnAmount;
    if (buyAmount) updateData.buyAmount = buyAmount;
    if (releaseCurve) updateData.releaseCurve = releaseCurve;

    const result = await db.collection('tokens').updateOne(
      { _id: new ObjectId(tokenId as string) },
      { $set: updateData }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }

    const updatedToken = await db.collection('tokens').findOne({ _id: new ObjectId(tokenId as string) });

    res.status(200).json({ success: true, data: updatedToken });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const handleDeleteToken = async (req: NextApiRequest, res: NextApiResponse, db: any) => {
  try {
    const { tokenId } = req.query;

    if (!tokenId) {
      return res.status(400).json({ success: false, message: 'Missing token ID' });
    }

    const result = await db.collection('tokens').deleteOne({ _id: new ObjectId(tokenId as string) });

    if (!result.deletedCount) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }

    res.status(200).json({ success: true, message: 'Token deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
