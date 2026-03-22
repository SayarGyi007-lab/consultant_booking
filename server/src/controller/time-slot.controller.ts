import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import timeSlotService from "../service/time-slot.service";
import { buildQuery } from "../utils/pagination";


export const createTimeSlot = asyncHandler( async (req: Request, res: Response) => {

    const slot = await timeSlotService.createTimeSlot(req.body);

    res.status(201).json({
      success: true,
      data: slot
    });
  }
);


export const getAllTimeSlots = asyncHandler(async (req: Request, res: Response) => {

    const query = buildQuery(req);

    const slots = await timeSlotService.getAllTimeSlots(query);

    res.json({success: true,...slots});
  }
);


// export const getTimeSlotById = asyncHandler( async (req: Request, res: Response) => {

//     const {id} = req.params as {id: string}

//     const slot = await timeSlotService.getTimeSlotById(id);

//     res.json({success: true, ...slot});
//   }
// );


//Get consultant slots
// export const getSlotsByConsultant = asyncHandler( async (req: Request, res: Response) => {

//     const { consultantId } = req.params as {consultantId: string};

//     const slots = await timeSlotService.getSlotsByConsultant(consultantId);

//     res.json({ success: true,
//       data: slots
//     });
//   }
// );


// get available slots
export const getAvailableSlotsByConsultant = asyncHandler( async (req: Request, res: Response) => {

    const { consultantId } = req.params  as {consultantId: string};

    const slots = await timeSlotService.getAvailableSlotsByConsultant(consultantId);

    res.json({success: true,
      data: slots
    });
  }
);


export const updateTimeSlot = asyncHandler( async (req: Request, res: Response) => {

    const {id} = req.params as {id: string}
    
    const slot = await timeSlotService.updateTimeSlot(
      id,
      req.body
    );

    res.json({data: slot});
  }
);


export const deleteTimeSlot = asyncHandler( async (req: Request, res: Response) => {

    const {id} = req.params as {id: string}
    const result = await timeSlotService.deleteTimeSlot(id);

    res.json(result);
  }
);