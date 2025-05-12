const API_URL = import.meta.env.VITE_API_URL ;

export const sendContactEmail = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/api/contact/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderEmail: formData.email,
        subject: `Liên hệ từ ${formData.name}`,
        message: formData.message,
        createdAt: new Date().toISOString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi gửi email');
    }

    return { success: true, message: data.message || 'Gửi thành công!' };
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    throw new Error(error.message || 'Không thể gửi email. Vui lòng thử lại!');
  }
};