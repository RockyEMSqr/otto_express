import { Controller, Get, Post } from "../..";
import type { Request, Response } from 'express';

const people = [
    {
        name: 'Rocky Cutri'
    },
    {
        name: 'FooFoo BooBoo'
    }
];
@Controller('/api/people')
export class PeopleController {
    @Get('/')
    list(req: Request, res: Response) {
        res.json(people);
    }
    @Post('/')
    addToList(req: Request, res: Response) {
        people.push(req.body);
        res.json(people.length);
    }
    @Post('/remove')
    remove(req: Request, res: Response) {
        people.splice(req.body.index)
        res.json(people.length);
    }
}