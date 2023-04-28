import express from 'express';

import {getEvents, postEvent, updateEvent, deleteEvent} from '../../../../../controllers/event.js';

//Initialize express router
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Event:
 *          type: object
 *          require:
 *              - name
 *              - tagline
 *              - schedule
 *              - moderator
 *              - category
 *              - sub_category
 *          properties:
 *              type:
 *                  type: string
 *                  default: 'event'
 *                  description: "Type value is event by default"
 *              uid:
 *                  type: string
 *                  description: "User id"
 *              name:
 *                  type: String
 *                  description: "Name of the event"
 *              tagline:
 *                  type: string
 *                  description: "A proper tag-line for the event"
 *              schedule:
 *                  type: date
 *                  description: "Timestamp"
 *              description:
 *                  type: string
 *                  description: "Description for the event"
 *              files:
 *                  type: [base64]
 *                  description: "Image file"
 *              moderator:
 *                  type: string
 *                  description: "A user who is going to host"
 *              category:
 *                  type: string
 *                  description: "Category of the event"
 *              sub_category:
 *                  type: string
 *                  description: "Sub category of the event"
 *              rigor_rank:
 *                  type: integer
 *                  description: "Rank for event"
 *              attendees:
 *                  type: [string]
 *                  description: "Array of user Id's who is attending the event"
 *          example:
 *              type: event
 *              uid: 18 (userId)
 *              name: Happy new year celebration
 *              tagline: Happy new year
 *              schedule: 2023-04-26T10:45:12.493Z
 *              description: Happy new year 2024 celebration event
 *              files: [data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAAt...]
 *              moderator: Abhishek Sharma
 *              category: Celebration
 *              sub_category: Party
 *              rigor_rank: 1
 *              attendees: [userId]
 *      Error:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  description: Error message
 *      createEvent:
 *          type: object
 *          require:
 *              - name
 *              - tagline
 *              - schedule
 *              - moderator
 *              - category
 *              - sub_category
 *          properties:
 *              name:
 *                  type: String
 *                  description: "Name of the event"
 *              tagline:
 *                  type: string
 *                  description: "A proper tag-line for the event"
 *              schedule:
 *                  type: date
 *                  description: "Timestamp"
 *              description:
 *                  type: string
 *                  description: "Description for the event"
 *              files:
 *                  type: [base64]
 *                  description: "Image file"
 *              moderator:
 *                  type: string
 *                  description: "A user who is going to host"
 *              category:
 *                  type: string
 *                  description: "Category of the event"
 *              sub_category:
 *                  type: string
 *                  description: "Sub category of the event"
 *              rigor_rank:
 *                  type: integer
 *                  description: "Rank for event"
 *          example:
 *              name: Happy new year celebration
 *              tagline: Happy new year
 *              schedule: 2023-04-26T10:45:12.493Z
 *              description: Happy new year 2024 celebration event
 *              files: [data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAAtLLAAPnr8wD37fkAjJvoAPvt+QBSgt4AUobhAN+81AD99PwAXYLVAHaT4wD6/v8AGRg1AF5mpgCPqPQA+/7/AGCD2AA+S7kA/P7/AF+I3gDIiMEA8uj0APLq8QAUEBUAKSEsAPPA4AAQFyEAhp3vAPjv9wCjsfQAGRUbAElgwgD78/oAg32IAEJAWwAgGiEAQU23AA8LEAD05vgATXnXAPHB2wAWDhkA9uz4AO/J4QBokegAGBQZANva+QBplesAQ2XJAIui7QDr3ecA/Pb7AP/z+wDqtNkA5rvcAHKf7gBzn+4AbH3aAPHn8wDx6fAAFA4RABMPFABacsMAFhAXAPXr9gBtjOMA+uz5ABkWIAD68vkA+/L5AGmY7ABul+kAWXzhACAYHQAfGSAAHxwgAHSZ7wDut9oAc6PyACUhJgAyKF4AJyAjAHmh7AB5ou8A3dHpAOzI4AD16/cA9e30APfu9wAXEh4AbY3nAEVeyACRXIIA5NzmAP7y+gBcgNwA5bjVAEFOtACHk9UA8efsABQOEwD06vUAu4vyAE593QD48PUA+fH4APrx+ABvjegAeorfAEZozADku9YAYILaAG6HzgCAmO4A7MLiAPXp8wD06vYAExAaAN2l1AB7qPEA4KXUAI+LkgDlp8gA8cXiAOzO4gAXFhoA4t7lABgUHQD68fkAa5PpAOC01AD98fkAiqfuAP7x+QD+8vwA/fX8AOjk5QB0newAxGGbAPDo8QBNc9MA8eb0ACYiLAD16/EATH3WAGmO5ACEpO8A+O76APjw9wAzHjIAWHPuAGqe5wDhuNgA/vX9AFiD3wDq4ukAeZnqAGiD1gAkHC0AlXfnACcgJwDz6fUAZWBmAPjp9QAVEhkAg6DtAPjs9QBdcc4A9+34ABkSGQD67/UA/PD4AObe5wD98PgAZ3fFAPz0+wDmjLAAjK3wAPz+/gAOCA4AHBk3AJCu8wCUqvAAXYngAEp21QBgjuYA9OrwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAae01Ul7EAAAAAAAAAAE4sliBPODCLd28AAAAAAFYpfGEtOZhHMZk3NgAAAF8FfXNdFI25BpF5gwikAAA1rK4CUQpTSChiFY51QwAQsIaGp2CoZ6BuaFVmV1crE0YhhC+dpnJbioKvJ1mUA7MJsEVxDx6FuLa3EYypK5QTNLBrDrKeQptJeHBjWCsDE5qGhLUcC7oHXJI/I6JXqQyIamk9bQQ6MpNsG3o7FlcAsGqQZapanw0SJY+jOzsAAIeVq6WhSypEdoAurV5BAAAAgR0iGD5QtEwmH5w8AAAAAABYuxlKUkAkfjMXAAAAAAAAAAB0iQF/ZDwAAAAAAPgfAADgBwAAwAMAAIABAACAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAEAAIABAADAAwAA4AcAAPgfAAA=]
 *              moderator: Abhishek Sharma
 *              category: Celebration
 *              sub_category: Party
 *              rigor_rank: 1
 *      
 *      createEventResponse: 
 *          properties:
 *              event_id:
 *                  type: string
 *                  description: event_id 
 *          example:
 *              event_id: 644917e5c7437884cc4b91d6
 * 
 *      updateEventResponse: 
 *          properties:
 *              message:
 *                  type: string
 *                  description: message
 *          example:
 *              message: event updated successfully
 * 
 *      deleteEventResponse: 
 *          properties:
 *              message:
 *                  type: string
 *                  description: message 
 *          example:
 *              message: event deleted successfully
 *          
*/

//handle routes

/**
 * @swagger
 * tags:
 *  name: Events
 *  description: The events managing API
 */

/**
 * @swagger
 * /api/v3/app/events?id={event_id}:
 *  get:
 *      summary: Request single event which matches event_id
 *      tags: [Events]
 *      parameters:
 *          -  in: path
 *             name: event_id
 *             schema:
 *              type: string
 *             required: true
 *             description: The event id
 *      responses:
 *          200:
 *              description: Event details
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Event'
 *          404:
 *              description: Error message
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *                              
 */

/**
 * @swagger
 * /api/v3/app/events?type={type}&limit={limit}&page={page}:
 *  get:
 *      summary: Request multiple events with limit per page
 *      tags: [Events]
 *      parameters:
 *          -  in: path
 *             name: type
 *             schema:
 *              type: string
 *              default: latest
 *             required: true
 *             description: The recency
 *          -  in: path
 *             name: limit
 *             schema:
 *              type: integer
 *              default: 5
 *             required: true
 *             description: Number of event per page
 *          -  in: path
 *             name: page
 *             schema:
 *              type: integer
 *              default: 1
 *             required: true
 *             description: Required page
 *      responses:
 *          200:
 *              description: Events details
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Event'
 *          404:
 *              description: Error message
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *                              
 */

router.get('/', getEvents);

/**
 * @swagger
 * /api/v3/app/events:
 *  post:
 *      summary: Create a new event 
 *      tags: [Events]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/createEvent'
 *      responses:
 *          201:
 *              description: Event successfully created
 *              content:
 *                  application/json: 
 *                      schema:
 *                          $ref: '#/components/schemas/createEventResponse'
 *          409:
 *              description: Error message
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */

router.post('/', postEvent);

/**
 * @swagger
 * /api/v3/app/events/{id}:
 *  put:
 *      summary: Update an event 
 *      tags: [Events]
 *      parameters:
 *          -  in: path
 *             name: id
 *             schema:
 *              type: string
 *             required: true
 *             description: The id of event which has to be updated
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/createEvent'
 *      responses:
 *          201:
 *              description: Event successfully updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/updateEventResponse'
 *          409:
 *              description: Error message
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */

router.put('/:id', updateEvent);

/**
 * @swagger
 * /api/v3/app/events/{id}:
 *  delete:
 *      summary: Delete an event 
 *      tags: [Events]
 *      parameters:
 *          -  in: path
 *             name: id
 *             schema:
 *              type: string
 *             required: true
 *             description: The id of event which has to be deleted
 *      responses:
 *          201:
 *              description: Event successfully deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/deleteEventResponse'
 *          409:
 *              description: Error message
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */

router.delete('/:id', deleteEvent);

export default router;