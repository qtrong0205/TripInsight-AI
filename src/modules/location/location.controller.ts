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
    },
    getLocationById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const location = await locationService.getLocationById(id);
            res.status(200).json({ success: true, data: location });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    getSimilarLocations: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const location = await locationService.getSimilarLocations(id);
            res.status(200).json({ success: true, data: location });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}