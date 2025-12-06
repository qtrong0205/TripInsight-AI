import { Request, Response } from 'express';
import { locationService } from './location.service';

export const locationController = {
    getAllLocations: (req: Request, res: Response) => {
        const location = locationService.getAllLocations()
        res.status(200).json(location)
    }
}