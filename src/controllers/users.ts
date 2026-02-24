import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';

const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' }));
};

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректный _id пользователя' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
    });
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
    });
};
