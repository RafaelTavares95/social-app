import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      auth: {
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        name: 'Name',
        welcome: 'Welcome',
        loginToContinue: 'Login to continue',
        createAccount: 'Create Account',
        joinUs: 'Join our community today',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signingIn: 'Signing In...',
        signingUp: 'Signing Up...',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        passwordStrength: 'Password strength',
        tooShort: 'Too short',
        weak: 'Weak',
        medium: 'Medium',
        good: 'Good',
        strong: 'Strong',
        accountCreatedSuccess: 'Account created successfully! Please log in.',
        createAccountError: 'Failed to create account. Please try again.',
      },
      header: {
        editProfile: 'Edit Profile',
        profile: 'Profile',
        logout: 'Logout',
        appTitle: 'Social',
        appSubtitle: 'App',
        tagline: 'Connect with people around the world',
      },
      dashboard: {
        welcomeBack: 'Welcome back, {{name}}!',
        profileTitle: 'Your Profile',
        profileDesc: 'Explore your network and connect with new friends around the world.',
        activityTitle: 'Recent Activity',
        activityDesc: 'You have 3 new notifications and 2 friend requests.',
        communityTitle: 'Communities',
        communityDesc: 'Join groups that share your interests.',
        viewDetails: 'View Details',
        viewAll: 'View All',
        explore: 'Explore',
        alertEditProfile: 'Edit profile feature is under development.',
      },
      errors: {
        title: 'Something went wrong',
        subtitle: "We're having trouble connecting to our servers.",
        retry: 'Try Again',
        details: 'Error Details',
        backToLogin: 'Back to Login',
      },
      common: {
        language: 'Language',
        english: 'English',
        portuguese: 'Portuguese',
        save: 'Save',
        cancel: 'Cancel',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
      },
      profile: {
        editTitle: 'Edit Profile',
        editSubtitle: 'Update your account information',
        nameLabel: 'Full Name',
        passwordLabel: 'New Password (leave blank to keep current)',
        updateSuccess: 'Profile updated successfully!',
        updateError: 'Failed to update profile. Please try again.',
        emailNotEditable: 'Email address cannot be changed',
        viewTitle: 'Your Profile',
        viewSubtitle: 'View your account information',
        editProfile: 'Edit Profile',
      }
    }
  },
  pt: {
    translation: {
      auth: {
        login: 'Entrar',
        register: 'Cadastrar',
        email: 'E-mail',
        password: 'Senha',
        name: 'Nome',
        welcome: 'Bem-vindo',
        loginToContinue: 'Faça login para continuar',
        createAccount: 'Criar Conta',
        joinUs: 'Junte-se à nossa comunidade hoje',
        dontHaveAccount: 'Não tem uma conta?',
        alreadyHaveAccount: 'Já tem uma conta?',
        signIn: 'Entrar',
        signUp: 'Cadastrar',
        signingIn: 'Entrando...',
        signingUp: 'Cadastrando...',
        rememberMe: 'Lembrar de mim',
        forgotPassword: 'Esqueceu a senha?',
        passwordStrength: 'Força da senha',
        tooShort: 'Muito curta',
        weak: 'Fraca',
        medium: 'Média',
        good: 'Boa',
        strong: 'Forte',
        accountCreatedSuccess: 'Conta criada com sucesso! Por favor, faça login.',
        createAccountError: 'Falha ao criar conta. Por favor, tente novamente.',
      },
      header: {
        editProfile: 'Editar Perfil',
        profile: 'Perfil',
        logout: 'Sair',
        appTitle: 'Social',
        appSubtitle: 'App',
        tagline: 'Conecte-se com pessoas ao redor do mundo',
      },
      dashboard: {
        welcomeBack: 'Bem-vindo de volta, {{name}}!',
        profileTitle: 'Seu Perfil',
        profileDesc: 'Explore sua rede e conecte-se com novos amigos ao redor do mundo.',
        activityTitle: 'Atividade Recente',
        activityDesc: 'Você tem 3 novas notificações e 2 solicitações de amizade.',
        communityTitle: 'Comunidades',
        communityDesc: 'Entre em grupos que compartilham dos seus interesses.',
        viewDetails: 'Ver Detalhes',
        viewAll: 'Ver Tudo',
        explore: 'Explorar',
        alertEditProfile: 'Funcionalidade de editar perfil em desenvolvimento.',
      },
      errors: {
        title: 'Algo deu errado',
        subtitle: 'Estamos com dificuldades para conectar aos nossos servidores.',
        retry: 'Tentar Novamente',
        details: 'Detalhes do Erro',
        backToLogin: 'Voltar para o Login',
      },
      common: {
        language: 'Idioma',
        english: 'Inglês',
        portuguese: 'Português',
        save: 'Salvar',
        cancel: 'Cancelar',
        loading: 'Carregando...',
        success: 'Sucesso',
        error: 'Erro',
      },
      profile: {
        editTitle: 'Editar Perfil',
        editSubtitle: 'Atualize as informações da sua conta',
        nameLabel: 'Nome Completo',
        passwordLabel: 'Nova Senha (deixe em branco para manter a atual)',
        updateSuccess: 'Perfil atualizado com sucesso!',
        updateError: 'Falha ao atualizar o perfil. Por favor, tente novamente.',
        emailNotEditable: 'O endereço de e-mail não pode ser alterado',
        viewTitle: 'Seu Perfil',
        viewSubtitle: 'Visualize as informações da sua conta',
        editProfile: 'Editar Perfil',
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
