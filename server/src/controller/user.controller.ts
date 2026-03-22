import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authentication";
import UserService from "../service/user.service";
import { asyncHandler } from "../utils/async-handler";
import { buildQuery } from "../utils/pagination";


const userService = new UserService();

export const getUsers = asyncHandler(async (req: Request, res: Response) => {

  const query = buildQuery(req);

  const { users, total } = await userService.getUsers(query);

  res.json({
    success: true,
    data: users,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit)
    }
  });

});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {

  const { id } = req.params as { id: string };

  const user = await userService.getUserById(id);

  res.json({
    success: true,
    data: user
  });

});

export const getCurrentUser = asyncHandler( async (req: AuthRequest, res: Response) => {

    const user = await userService.getUserById(req.user!.id);

    res.json({
      success: true,
      data: user
    });

  }
);


export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {

  const { id } = req.params as { id: string };

  const user = await userService.updateUser(id, req.body);

  res.json({
    success: true,
    data: user
  });

});


export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {

  const { currentPassword, newPassword } = req.body;

  const result = await userService.changePassword(
    req.user!.id,
    currentPassword,
    newPassword
  );

  res.json(result);

});


export const softDeleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {

  const { id } = req.params as { id: string };

  const result = await userService.softDeleteUser(id)

  res.status(200).json(result);


});

export const restoreUser = asyncHandler(async (req: AuthRequest, res: Response) => {

  const { id } = req.params as { id: string };

  const result = await userService.restoreUser(id)

  res.status(200).json(result);


});

export const permanentDeleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {

  const { id } = req.params as { id: string };

  const result = await userService.permanentDeleteUser(id)

  res.status(200).json(result);


});

