import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const formatDate = (dateStr) => {
    if (!dateStr) return '';

    const date = dayjs.utc(dateStr);

    if (!date.isValid()) return '';

    return date.format('DD/MM/YYYY');
};

export const formatarData = (dateStr) => {
    if (!dateStr) return '';

    const date = dayjs.utc(dateStr, 'YYYY-MM-DD', true);

    if (!date.isValid()) return '';

    return date.format('DD/MM/YYYY');
};

export const formatarMesAno = (data) => {
    if (!data) return '';

    const date = dayjs.utc(data, 'YYYY-MM', true);

    if (!date.isValid()) return '';

    return `${date.format('MMMM').charAt(0).toUpperCase() + date.format('MMMM').slice(1)} de ${date.format('YYYY')}`;
};
