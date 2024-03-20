const gallery = require('../models/galleries');

exports.getByTitle = async (req, res, next) => {
    const page = +req.query.page || 2; //Converting it to integer
    const PER_PAGE_COUNT = 2;

    let searchValue = req.query.searchValue;
    let searchBy = req.query.searchBy;    
    let totalgalleries , galleriesCount , galleries; 
    try {

       /*previousPage: page - 1,
            hasNextPage: PER_PAGE_COUNT * page < totalgalleries,
            hasPreviousPage: page > 1,*/


      if( (searchBy == null || searchBy=='' || searchBy==undefined) && (searchValue == null || searchValue=='' || searchValue==undefined) )
      {
        galleriesCount = await gallery.countDocuments();
        galleries = await gallery.find().limit(PER_PAGE_COUNT);

      }
      else
      {
        galleriesCount = await gallery.countDocuments({[searchBy]: {$regex: decodeURI(searchValue), $options: 'i'}});
        galleries = await gallery.find({[searchBy]: {$regex: decodeURI(searchValue), $options: 'i'}}).skip((page - 1) * PER_PAGE_COUNT).limit(PER_PAGE_COUNT);

      }
                
        totalgalleries = galleriesCount;
        let pagination = {
            totalgalleries: totalgalleries,
            currentPage: page,            
            galleriesList: galleries
          }; 
          res.status(200).json({status:"success", "message":"galleries Found",data:pagination});      
    } catch (error) {
        res.status(500).json({status:"error", "message":error})
    }   
};

/*
exports.getByTitle = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalgalleries;
    gallery.countDocuments({Title: {$regex: decodeURI(req.params.title), $options: 'i'}})
      .then(galleriesCount =>{
        totalgalleries=galleriesCount;
        return gallery.find({Title: {$regex: decodeURI(req.params.title), $options: 'i'}}).skip((page - 1) * PER_PAGE_COUNT).limit(PER_PAGE_COUNT);
      })
      .then(galleries => {
        let pagination = {
          totalgalleries: totalgalleries,
          currentPage: page,
          previousPage: page - 1,
          hasNextPage: PER_PAGE_COUNT * page < totalgalleries,
          hasPreviousPage: page > 1,
          galleriesList: galleries
        };

        res.status(200).json({status:"success", "message":"galleries Found",data:pagination});
      })
    .catch(err => {
      next(err);
    });
};
*/

// module.exports = {

//     getByTitle : function (req , res , next)
//     {  
//         gallery.find({Title: {$regex: decodeURI(req.params.title), $options: 'i'}})
//         .then((galleriesList) => {
//             if(galleriesList.length === 0 || galleriesList == null || galleriesList == undefined)
//             {
//                 res.status(200).json({status:"success",message:"No result Found",data:{}});
//             }
//             else
//             {
//                 res.status(200).json({status:"success",message:"Results Found",data:{galleriesList}});
//             }            
//         })
//         .catch((error) => {
//             //When there are errors We handle them here
//             console.log(error);
//             res.status(400).json({status:"error",message:"Bad Request",data:null});
//         });

//     },
//     getByYear : function (req , res , next)
//     {
//     }


// }