import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuestionList from '@components/QuestionList/QuestionList';
import QuestionService from '@services/QuestionService';
import CategoryService from '@services/CategoryService';
import type { Question, ListType } from '@types';

interface CategoryPageProps {
  filter?: ListType;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ filter }) => {
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState<string>('');
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    if (!id) return;

    const categoryId = parseInt(id, 10);
    const category = CategoryService.getCategoryById(categoryId);
    
    if (!category) return;

    let categoryQuestions: Question[];
    let pageTitle = category.name;

    if (filter) {
      switch (filter) {
        case 'favorite':
          categoryQuestions = QuestionService.getFavoriteQuestions(categoryId);
          pageTitle = `${category.name} - Избранное`;
          break;
        case 'known':
          categoryQuestions = QuestionService.getKnownQuestions(categoryId);
          pageTitle = `${category.name} - Точно знаю`;
          break;
        case 'hard':
          categoryQuestions = QuestionService.getHardQuestions(categoryId);
          pageTitle = `${category.name} - Плохо запоминающиеся`;
          break;
        default:
          categoryQuestions = QuestionService.getQuestionsByCategory(categoryId);
      }
    } else {
      categoryQuestions = QuestionService.getQuestionsByCategory(categoryId);
    }

    setQuestions(categoryQuestions);
    setTitle(pageTitle);
  }, [id, filter, updateTrigger]);

  const handleUpdate = () => {
    // Триггерим обновление списка вопросов
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className="category-page">
      <QuestionList
        questions={questions}
        title={title}
        showCategoryToggle={!filter}
        categoryId={id ? parseInt(id, 10) : undefined}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default CategoryPage;