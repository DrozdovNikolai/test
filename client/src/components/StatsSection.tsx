import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Database, FileText, Shield, X, Zap, Cpu, Train, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { statsSectionCertificateMap } from '@/components/data/statsSectionCertificates';
export default function StatsSection() {
    const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const navigate = useNavigate();

    // Используем хук для загрузки данных
    const { products, loading, error } = useProducts();

    // Рассчитываем статистику на основе данных из БД
    const totalProducts = products.length;
    const registeredInRegistry = products.filter(p => p.reg_program_num).length;
    const registeredInRospatent = products.filter(p => p.registration_num).length;

    // Функция для получения иконки по названию продукта
    const getProductIcon = (productTitle: string) => {
        const titleLower = productTitle.toLowerCase();

        if (titleLower.includes('профит-эс') || titleLower.includes('profit-es')) {
            return Zap;
        }
        if (titleLower.includes('профит-лс') || titleLower.includes('profit-ls')) {
            return Train;
        }
        if (titleLower.includes('профит-мо') || titleLower.includes('profit-mo')) {
            return Calculator;
        }

        return Cpu;
    };

    // Функция для перехода на страницу продукта
    const handleProductClick = (productId: number, productTitle: string) => {
        if (productTitle.toLowerCase().includes('профит-эс') ||
            productTitle.toLowerCase().includes('profit-es') ||
            productId === 1) {
            navigate('/profitEs');
        } else if (productTitle.toLowerCase().includes('профит-лс') ||
            productTitle.toLowerCase().includes('profit-ls') ||
            productId === 2) {
            navigate('/profitLs');
        } else if (productTitle.toLowerCase().includes('профит-мо') ||
            productTitle.toLowerCase().includes('profit-mo') ||
            productId === 3) {
            navigate('/profitMo');
        } else {
            navigate(`/product/${productId}`);
        }
    };

    const handleOpenCertificate = (certificatePath: string) => {
        const fileName = certificatePath.split('/').pop();
        const resolvedCertificate = fileName ? statsSectionCertificateMap[fileName] : undefined;
        setSelectedCertificate(resolvedCertificate ?? certificatePath);
        setZoom(1);
    };

    const handleCloseCertificate = () => {
        setSelectedCertificate(null);
        setZoom(1);
    };

    if (loading) {
        return (
            <section id="cases" className="pt-10 pb-16 bg-card dark:from-slate-900 dark:to-blue-900/20 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8 text-center py-12">
                    <p>Загрузка данных...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="cases" className="pt-10 pb-16 bg-card dark:from-slate-900 dark:to-blue-900/20 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8 text-center py-12 text-red-500">
                    <p>Ошибка загрузки данных: {error}</p>
                </div>
            </section>
        );
    }

    return (
        <section id="cases" className="py-12 sm:py-12 bg-beige/50 overflow-hidden">
            <div className="container mx-auto h-full px-4 lg:px-8">
                <div className="text-left mb-10 sm:mb-14 lg:mb-16">
                    <h2 className="text-5xl font-bold tracking-tight text-brown-dark dark:text-beige mb-3">
                        Собственная разработка
                    </h2>
                    <p className="text-brown text-sm mt-6 sm:mt-3 lg:mt-8 sm:text-lg dark:text-beige mb-3">
                        Мы сотрудничаем с компаниями из разных секторов экономики, предлагая индивидуальные решения с учетом специфики каждой отрасли
                    </p>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
                    {/* Карточки статистики */}
                    <Card className="group bg-white  rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none transition-all duration-300 h-full border border-beige/30 dark:border-brown/30">
                        <CardContent className="p-0 h-full">
                            <div className="flex flex-col h-full justify-center">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-brown-dark ">Всего продуктов</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 text-brown-dark  sm:mt-1.5 lg:mt-2">{totalProducts}</p>
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-brown-dark rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 text-beige-light">
                                        <Database className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group bg-white  rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none transition-all duration-300 h-full border border-beige/30 dark:border-brown/30">
                        <CardContent className="p-0 h-full">
                            <div className="flex flex-col h-full justify-center">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-brown-dark ">Зарегистрировано в Реестре ПО</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 text-brown-dark  sm:mt-1.5 lg:mt-2">{registeredInRegistry}</p>
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-brown-dark rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 text-beige-light">
                                        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group bg-white  rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none transition-all duration-300 h-full border border-beige/30 dark:border-brown/30">
                        <CardContent className="p-0 h-full">
                            <div className="flex flex-col h-full justify-center">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-brown-dark ">Зарегистрировано в Роспатенте</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 text-brown-dark  sm:mt-1.5 lg:mt-2">{registeredInRospatent}</p>
                                    </div>
                                    <div className="flex-shrink-0 ml-2 sm:ml-3 lg:ml-4 flex items-center justify-center">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-brown-dark rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 text-beige-light">
                                            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Таблица продуктов */}
                <div className="bg-white  rounded-xl overflow-hidden shadow-xl border border-beige/30 dark:border-brown/30">
                    <div className="px-6 py-4 bg-white  border-b border-beige/50 dark:border-brown/50">
                        <h3 className="text-lg font-medium text-brown-dark ">Наши разработки</h3>
                        <p className="text-sm text-brown  mt-1">
                            Автоматизированные системы и программные решения
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <Table>
                            <TableHeader className="bg-white ">
                                <TableRow className="border-b border-beige/50 dark:border-brown/50 hover:bg-transparent">
                                    <TableHead className="w-[350px] font-bold text-brown-dark dark:text-brown-dark text-center">Продукт</TableHead>
                                    <TableHead className="font-bold text-brown-dark dark:text-brown-dark text-center"></TableHead>
                                    <TableHead className="w-[180px] font-bold text-brown-dark dark:text-brown-dark text-center">Платформа</TableHead>
                                    <TableHead className="w-[150px] font-bold text-brown-dark dark:text-brown-dark text-center">Регистрация</TableHead>
                                    <TableHead className="w-[140px] font-bold text-brown-dark dark:text-brown-dark text-center">Сертификаты</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => {
                                    const ProductIcon = getProductIcon(product.title);

                                    return (
                                        <TableRow
                                            key={product.id}
                                            className="group bg-white hover:bg-beige transition-all duration-200 border-b border-beige/50 dark:border-brown/50 last:border-0"
                                        >
                                            <TableCell className="align-middle">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brown-dark flex items-center justify-center">
                                                        <ProductIcon className="w-6 h-6 text-beige-light dark:text-beige" />
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => handleProductClick(product.id, product.title)}
                                                            className="font-semibold text-base leading-tight transition-colors text-brown-dark text-left hover:underline 
                       select-none
                       ring-0 focus:ring-0 focus:ring-offset-0
                       outline-none focus:outline-none focus-visible:outline-none
                       active:outline-none active:ring-0
                       focus:border-transparent
                       px-2 py-1 -mx-2 flex items-center gap-2
                       focus:bg-transparent"
                                                            style={{
                                                                outline: 'none',
                                                                WebkitTapHighlightColor: 'transparent',
                                                            }}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                e.currentTarget.style.outline = 'none';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
                                                            onFocus={(e) => {
                                                                e.currentTarget.style.outline = 'none';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                                e.currentTarget.style.border = 'none';
                                                            }}
                                                            onTouchStart={(e) => {
                                                                e.currentTarget.style.outline = 'none';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
                                                        >
                                                            {product.title}
                                                        </button>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="align-middle">
                                                <p className="line-clamp-2 text-sm text-brown/80 dark:text-brown-dark">
                                                    {product.short_description}
                                                </p>
                                            </TableCell>

                                            <TableCell className="align-middle">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-beige-light text-xs bg-brown-dark"
                                                >
                                                    {product.platform}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="align-middle">
                                                <div className="space-y-2">
                                                    {product.registration_num ? (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                                                <FileText className="w-3 h-3 text-brown-dark" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-brown-dark">Роспатент</div>
                                                                <div className="font-mono text-sm font-medium text-brown-dark">№{product.registration_num}</div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-brown-dark">Не зарегистрировано</div>
                                                    )}

                                                    {product.reg_program_num && (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                                                <FileText className="w-3 h-3 text-brown-dark" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-brown-dark">Реестр ПО</div>
                                                                <div className="font-mono text-sm text-brown-dark font-medium">№{product.reg_program_num}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell className="align-middle">
                                                <div className="flex justify-end gap-2">
                                                    {product.certificate_image && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleOpenCertificate(product.certificate_image!)}
                                                            className="h-8 px-3 text-beige bg-brown-dark font-medium
                  bg-brown-dark border border-brown-dark
                  text-beige-light  font-medium
                  dark:bg-beige dark:text-brown-dark
                  hover:bg-white hover:text-brown-dark
                  dark:hover:border
                  dark:hover:border-brown-dark
                  dark:hover:text-brown-dark dark:hover:bg-white
                  
                       select-none
                       ring-0 focus:ring-0 focus:ring-offset-0
                       outline-none focus:outline-none focus-visible:outline-none
                       active:outline-none active:ring-0
                       focus:border-brown-dark"
                                                            style={{
                                                                outline: 'none',
                                                                WebkitTapHighlightColor: 'transparent',
                                                            }}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                e.currentTarget.style.outline = 'none';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
                                                            onFocus={(e) => {
                                                                e.currentTarget.style.outline = 'none';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                                e.currentTarget.style.borderColor = 'brown';
                                                            }}
                                                            onTouchStart={(e) => {
                                                                e.currentTarget.style.outline = 'none';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
                                                        >
                                                            Показать
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="md:hidden">
                        <div className="divide-y divide-beige/50 dark:divide-brown/50">
                            {products.map((product) => {
                                const ProductIcon = getProductIcon(product.title);

                                return (
                                    <div
                                        key={product.id}
                                        className="p-4 bg-white hover:bg-beige dark:hover:bg-beige transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brown-dark flex items-center justify-center">
                                                <ProductIcon className="w-6 h-6 text-beige-light dark:text-beige" />
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => handleProductClick(product.id, product.title)}
                                                    className="font-semibold text-base leading-tight transition-colors text-brown-dark text-left hover:underline 
                       select-none
                       ring-0 focus:ring-0 focus:ring-offset-0
                       outline-none focus:outline-none focus-visible:outline-none
                       active:outline-none active:ring-0
                       focus:border-transparent
                       px-2 py-1 -mx-2 flex items-center gap-2
                       focus:bg-transparent"
                                                    style={{
                                                        outline: 'none',
                                                        WebkitTapHighlightColor: 'transparent',
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.currentTarget.style.outline = 'none';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.outline = 'none';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                        e.currentTarget.style.border = 'none';
                                                    }}
                                                    onTouchStart={(e) => {
                                                        e.currentTarget.style.outline = 'none';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    {product.title}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Описание */}
                                        {product.short_description && (
                                            <div className="mb-3 mt-3">
                                                <p className="line-clamp-2 text-sm text-brown/80 dark:text-brown-dark">
                                                    {product.short_description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Платформа */}
                                        <div className="mb-3">
                                            <div className="text-xs text-brown-dark dark:text-beige/70 mb-1">Платформа</div>
                                            <Badge
                                                variant="secondary"
                                                className="text-beige-light text-xs bg-brown-dark"
                                            >
                                                {product.platform}
                                            </Badge>
                                        </div>

                                        {/* Регистрация */}
                                        <div className="mb-3">
                                            <div className="text-xs text-brown-dark dark:text-beige/70 mb-2">Регистрация</div>
                                            <div className="space-y-2">
                                                {product.registration_num ? (
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                                            <FileText className="w-3 h-3 text-brown-dark" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-brown-dark">Роспатент</div>
                                                            <div className="font-mono text-sm font-medium text-brown-dark">№{product.registration_num}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-brown-dark">Не зарегистрировано</div>
                                                )}

                                                {product.reg_program_num && (
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                                            <FileText className="w-3 h-3 text-brown-dark" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-brown-dark">Реестр ПО</div>
                                                            <div className="text-xs text-brown-dark">№{product.reg_program_num}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Сертификаты */}
                                        <div className="flex justify-between items-center pt-2 border-t border-beige/50 hover:border-brown/50">
                                            <div className="text-xs text-brown-dark dark:text-beige/70">Сертификаты</div>
                                            <div>
                                                {product.certificate_image && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleOpenCertificate(product.certificate_image!)}
                                                        className="h-8 px-3 text-beige bg-brown-dark font-medium
                  bg-brown-dark border border-brown-dark
                  text-beige-light  font-medium
                  dark:bg-beige dark:text-brown-dark
                  hover:bg-white hover:text-brown-dark
                  dark:hover:border
                  dark:hover:border-brown-dark
                  dark:hover:text-brown-dark dark:hover:bg-white
                       select-none
                       ring-0 focus:ring-0 focus:ring-offset-0
                       outline-none focus:outline-none focus-visible:outline-none
                       active:outline-none active:ring-0
                       focus:border-brown-dark"
                                                        style={{
                                                            outline: 'none',
                                                            WebkitTapHighlightColor: 'transparent',
                                                        }}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.currentTarget.style.outline = 'none';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                        onFocus={(e) => {
                                                            e.currentTarget.style.outline = 'none';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                            e.currentTarget.style.borderColor = 'transparent';
                                                        }}
                                                        onTouchStart={(e) => {
                                                            e.currentTarget.style.outline = 'none';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        Показать
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Футер таблицы */}
                    <div className="bg-beige/30 dark:bg-brown-dark/30 border-t border-beige/50 hover:border-brown/50 dark:border-brown/50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-brown-dark">
                                Показано {products.length} из {products.length} продуктов
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно для отображения сертификата */}
            {selectedCertificate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
                    onClick={handleCloseCertificate}
                >
                    {/* Полупрозрачный фон */}
                    <div className="absolute inset-0 bg-brown-dark/80 dark:bg-brown/80 backdrop-blur-sm" />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCloseCertificate}
                        className="absolute top-4 right-4 z-10 h-10 w-10 
        /* Светлая тема */
        bg-white hover:bg-brown-dark 
        border border-beige/30 hover:border-brown-dark
        text-brown-dark hover:text-white
        
        /* Общие стили */
        rounded-full shadow-lg backdrop-blur-sm 
        transition-all duration-300"
                    >
                        <X className="w-5 h-5" />
                    </Button>

                    {/* Изображение сертификата */}
                    <img
                        src={selectedCertificate}
                        alt="Сертификат"
                        className="relative z-0 max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
                        style={{
                            transform: `scale(${zoom})`,
                            transformOrigin: 'center center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}
