export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '';
  const imageName = imagePath.split('/').pop();
  return `/images/${imageName}`;
};

export const formatQuestionNumber = (index: number, total: number): string => {
  const paddedIndex = String(index).padStart(String(total).length, '0');
  return `№${paddedIndex}`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};