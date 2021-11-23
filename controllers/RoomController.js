const Room = require('../models/room')

module.exports = {
    getRooms: async (req, res) => {
        try {
            let searchString = req.body.searchString
            let limit = req.body.limit
            let skip = req.body.skip
            let regexp = new RegExp("^"+ searchString, 'i')

            const count = await Room.countDocuments({ 
                $or: [
                    {room: regexp},
                ] 
            });

            await Room.aggregate([
                {
                    $match: {
                    $or: [
                        {room: regexp},
                    ]
                    }
                },
                { $limit: limit + skip },
                { $skip: skip }
                ]).exec((error, rooms) => {
                if(error) return res.json({response: false, message: error.message})
                return res.json({
                    response: true, 
                    data: rooms, 
                    count: count,
                    limit: limit,
                    skip: skip
                })
            })
        } catch (error) {
            return res.status(500).json({response:false, message: error.message})
        }
    },
    createRoom: async (req, res) => {
        try {
            let index
            let room = req.body.room
            
            await Room.findOne({},{},{sort:{created_at: -1}}, async (error, lastRecord) => {
                if(error) return res.status(500).json({response: false, message: error.message})
                index = lastRecord.index+1
                await new Room({
                    index,
                    room
                }).save(async(error,newRoom)=>{
                    if(error) return res.status(500).json({response: false, message: error.message})
                    return res.status(201).json({response: true, data: newRoom})
                })
            })
        } catch (error) {
            return res.status(500).json({response: false, message:error.message})
        }
    }
}
