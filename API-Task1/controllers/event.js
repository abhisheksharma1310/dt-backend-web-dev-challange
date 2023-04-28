
import mongoose from 'mongoose';

import Events from '../models/event.js';

//get events from database and send to client
export const getEvents = async (req, res) => {
    const {id} = req.query;
    const {type, limit, page} = req.query;
    if(id){
        try {
            const event = await Events.findById(id);
            res.status(200).json(event);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    } else if (type && limit && page){
        try {
        // get the starting index of every page
        const startIndex = (Number(page) - 1) * limit;
        const total = await Events.countDocuments({});
        const events = await Events.find().sort({_id: type === 'latest' ? -1 : 1}).limit(limit).skip(startIndex);
        res.status(200).json({data: events, currentPage: Number(page), numberofPages: Math.ceil(total/limit)});
        } catch (error) {
            res.status(404).json({message: error.message});
        }
    } else {
        res.status(404).json({message: 'invalid'});
    }
}

//create new event in database
export const postEvent = async (req, res) => {
    const event = req.body;
    const newEvent = new Events({...event, type: 'event' })
    try {
        await newEvent.save();
        res.status(201).json({event_id: newEvent._id});
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

//update event in database
export const updateEvent = async (req, res) => {
    const {id} = req.params;
    const event = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No event with id: ${id}`);
    try {
        await Events.findByIdAndUpdate(id, {...event, _id: id}, {new: true});
        res.status(201).json({message: 'event updated successfully'});
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

//delete event from database
export const deleteEvent = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No event with id: ${id}`);
    try {
        await Events.findByIdAndRemove(id);
        res.status(201).json({message: 'event deleted successfully.'});
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

