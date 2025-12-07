import { Request, Response } from 'express';
import { locationService } from './location.service';

export const locationController = {
    getAllLocations: async (req: Request, res: Response) => {
        try {
            const locations = await locationService.getAllLocations();
            res.status(200).json({ success: true, data: locations });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}