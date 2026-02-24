import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';

const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
    });
};

export const likeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
    });
};
