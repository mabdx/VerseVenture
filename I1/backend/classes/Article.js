//Attributes: title, content, author, categories, status (draft or published), Rating, Category
//Methods: writeArticle(), uploadArticle(), viewAllArticles(), viewUserArticles(), deleteArticle()
//viewArticlesByCategory(), toggleArticlesByCategory()
const Database = require('./Database');

async function saveArticle(title, article_picture, content, category, status) {
    try {
      const result = await Database.insertArticle(title, article_picture, content, category, status);
      return { success: result.success, message: result.message };
    } catch (error) {
      console.error('Error saving article:', error.message);
      return { success: false, message: 'An error occurred while saving article.' };
    }
}

async function getDraftArticles() {
    try {
        const draftArticles = await Database.GetDraftArticles();
        
        if (draftArticles && draftArticles.length > 0) {
            //console.log('Draft Articles:', draftArticles);
            return draftArticles;
        } else {
            console.log('No draft articles found.');
            return null;
        }
    } catch (error) {
        console.error('Error getting draft articles:', error.message);
        throw error;
    }
}

async function getPublishedArticles() {
    try {
        const publishedArticles = await Database.GetPublishedArticles();
        
        if (publishedArticles && publishedArticles.length > 0) {
            //console.log('Published Articles:', publishedArticles);
            return publishedArticles;
        } else {
            console.log('No published articles found.');
            return null;
        }
    } catch (error) {
        console.error('Error getting published articles:', error.message);
        throw error;
    }
}

module.exports = {
    saveArticle,
    getDraftArticles,
    getPublishedArticles
};
