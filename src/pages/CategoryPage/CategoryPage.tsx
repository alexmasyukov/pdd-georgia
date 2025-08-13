import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuestionList from '@components/Questions/QuestionList/QuestionList';
import QuestionService from '@services/QuestionService';
import CategoryService from '@services/CategoryService';
import LocalStorageService from '@services/LocalStorageService';
import type {Question, Category, QuestionList as QuestionListType} from '@/types';
import './CategoryPage.scss';

interface CategoryPageProps {
  listType?: QuestionListType;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ listType }) => {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDetailedHint, setShowDetailedHint] = useState(
    LocalStorageService.getShowDetailedHint()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);

        const [categoryData, questionsData] = await Promise.all([
          CategoryService.getCategoryById(id),
          listType
            ? QuestionService.getQuestionsByCategoryAndList(id, listType)
            : QuestionService.getQuestionsByCategory(id),
        ]);

        setCategory(categoryData);
        setQuestions(questionsData);
        setIsCompleted(LocalStorageService.isCategoryCompleted(id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, listType]);

  const handleToggleComplete = () => {
    if (!id) return;
    const newStatus = LocalStorageService.toggleCategoryComplete(id);
    setIsCompleted(newStatus);
  };

  const getPageTitle = () => {
    if (!category) return '';
    
    let title = category.name;
    if (listType === 'favorite') title += ' - Избранное';
    if (listType === 'known') title += ' - Точно знаю';
    if (listType === 'hard') title += ' - Сложные';
    
    return title;
  };

  if (loading) {
    return (
      <div className="category-page category-page--loading">
        <div className="category-page__loader">Загрузка...</div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="category-page category-page--error">
        <div className="category-page__error">
          {error || 'Категория не найдена'}
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-page__header">
        <h1 className="category-page__title">{getPageTitle()}</h1>
        {!listType && (
          <div className="category-page__controls">
            <label className="category-page__complete">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={handleToggleComplete}
              />
              <span>Категория изучена</span>
            </label>
            <label className="category-page__detailed-hint">
              <input
                type="checkbox"
                checked={showDetailedHint}
                onChange={(e) => {
                  const value = e.target.checked;
                  setShowDetailedHint(value);
                  LocalStorageService.setShowDetailedHint(value);
                }}
              />
              <span>Показывать вторую подсказку</span>
            </label>
          </div>
        )}
      </div>

      <QuestionList
        questions={questions}
        showDetailedHint={showDetailedHint}
        emptyMessage={
          listType
            ? `Нет вопросов в списке "${
                listType === 'favorite'
                  ? 'Избранное'
                  : listType === 'known'
                  ? 'Точно знаю'
                  : 'Сложные'
              }"`
            : 'В этой категории нет вопросов'
        }
      />
    </div>
  );
};

export default CategoryPage;